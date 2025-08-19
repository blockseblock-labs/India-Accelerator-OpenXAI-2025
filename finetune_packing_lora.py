import argparse
import multiprocessing
import os
import torch
from accelerate import PartialState
from datasets import load_dataset
from peft import LoraConfig
from transformers import (
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    logging,
    set_seed,
)
from trl import SFTTrainer, SFTConfig

def get_args():
    parser = argparse.ArgumentParser(
        description="Fine-tune a causal LM with packing, LoRA, and optional 4-bit quantization"
    )
    parser.add_argument("--model_id", type=str, default="bigcode/starcoder2-3b", help="Model identifier")
    parser.add_argument("--dataset_name", type=str, default="the-stack-smol", help="Dataset name")
    parser.add_argument("--subset", type=str, default="data/rust", help="Dataset subset path")
    parser.add_argument("--split", type=str, default="train", help="Dataset split")
    parser.add_argument("--dataset_text_field", type=str, default="content", help="Text field in dataset")
    parser.add_argument("--max_seq_length", type=int, default=1024, help="Max sequence length")
    parser.add_argument("--micro_batch_size", type=int, default=1, help="Per-device batch size")
    parser.add_argument("--gradient_accumulation_steps", type=int, default=4, help="Accumulation steps")
    parser.add_argument("--weight_decay", type=float, default=0.01, help="Weight decay")
    parser.add_argument("--attention_dropout", type=float, default=0.1, help="Attention dropout rate")
    parser.add_argument("--learning_rate", type=float, default=2e-4, help="Learning rate")
    parser.add_argument("--lr_scheduler_type", type=str, default="cosine", help="LR scheduler")
    parser.add_argument("--warmup_steps", type=int, default=100, help="Number of warmup steps")
    parser.add_argument("--num_proc", type=int, default=None, help="Processes for data loading")
    parser.add_argument("--bf16", action="store_true", help="Enable bf16 mixed precision")
    parser.add_argument("--output_dir", type=str, default="finetune_starcoder2", help="Output directory")
    parser.add_argument("--push_to_hub", action="store_true", help="Push final model to HF Hub")
    parser.add_argument("--seed", type=int, default=0, help="Random seed")
    return parser.parse_args()

def main(args):
    set_seed(args.seed)
    print(f"Using seed: {args.seed}")

    os.makedirs(args.output_dir, exist_ok=True)
    logging.set_verbosity_error()

    bnb_config = BitsAndBytesConfig(load_in_4bit=False)  # Or True if bitsandbytes installed

    lora_config = LoraConfig(
        r=8,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        task_type="CAUSAL_LM"
    )

    model = AutoModelForCausalLM.from_pretrained(
        args.model_id,
        quantization_config=bnb_config,
        device_map={"": PartialState().process_index},
        attention_dropout=args.attention_dropout,
    )

    data = load_dataset(
        args.dataset_name,
        data_dir=args.subset,
        split=args.split,
        num_proc=args.num_proc or multiprocessing.cpu_count()
    )

    sft_config = SFTConfig(
        packing=True,
        dataset_text_field=args.dataset_text_field,
        max_seq_length=args.max_seq_length
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=data,
        args=sft_config,
        peft_config=lora_config
    )

    trainer.train()

    final_ckpt = os.path.join(args.output_dir, "final_checkpoint")
    model.save_pretrained(final_ckpt)
    print(f"Saved final checkpoint to {final_ckpt}")

    if args.push_to_hub:
        trainer.push_to_hub("Upload model")
    print("Training complete! 🎉")

if __name__ == "__main__":
    args = get_args()
    main(args)
