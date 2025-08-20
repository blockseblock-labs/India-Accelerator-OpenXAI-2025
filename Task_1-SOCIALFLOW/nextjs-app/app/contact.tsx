export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkblue via-black to-black text-white flex items-center justify-center">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-white/80 mb-8">
          Have questions or need help? Reach out to us using the form below.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 h-32 resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}