"use client";
https://icp.ninja/editor
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Shield } from "lucide-react";
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from 'declarations/backend';
import { canisterId } from 'declarations/backend/index.js';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TherapySession = {
  id: string;
  date: string;
  therapist: string;
  duration: string;
  notes: string;
  transactionId: string;
};

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === 'ic'
    ? 'https://identity.ic0.app' // Mainnet
    : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'; // Local

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [fileTransferProgress, setFileTransferProgress] = useState();

  useEffect(() => {
    updateActor();
    setErrorMessage();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated]);

  async function updateActor() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const actor = createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
    const isAuthenticated = await authClient.isAuthenticated();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
  }

  async function login() {
    await authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  }

  async function logout() {
    await authClient.logout();
    updateActor();
  }

  async function loadFiles() {
    try {
      const fileList = await actor.getFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to load files:', error);
      setErrorMessage('Failed to load files. Please try again.');
    }
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    setErrorMessage();

    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    if (await actor.checkFileExists(file.name)) {
      setErrorMessage(`File "${file.name}" already exists. Please choose a different file name.`);
      return;
    }
    setFileTransferProgress({
      mode: 'Uploading',
      fileName: file.name,
      progress: 0
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = new Uint8Array(e.target.result);
      const chunkSize = 1024 * 1024; // 1 MB chunks
      const totalChunks = Math.ceil(content.length / chunkSize);

      try {
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, content.length);
          const chunk = content.slice(start, end);

          await actor.uploadFileChunk(file.name, chunk, BigInt(i), file.type);
          setFileTransferProgress((prev) => ({
            ...prev,
            progress: Math.floor(((i + 1) / totalChunks) * 100)
          }));
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setErrorMessage(`Failed to upload ${file.name}: ${error.message}`);
      } finally {
        await loadFiles();
        setFileTransferProgress(null);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  async function handleFileDownload(name) {
    setFileTransferProgress({
      mode: 'Downloading',
      fileName: name,
      progress: 0
    });
    try {
      const totalChunks = Number(await actor.getTotalChunks(name));
      const fileType = await actor.getFileType(name)[0];
      let chunks = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkBlob = await actor.getFileChunk(name, BigInt(i));
        if (chunkBlob) {
          chunks.push(chunkBlob[0]);
        } else {
          throw new Error(`Failed to retrieve chunk ${i}`);
        }

        setFileTransferProgress((prev) => ({
          ...prev,
          progress: Math.floor(((i + 1) / totalChunks) * 100)
        }));
      }

      const data = new Blob(chunks, { type: fileType });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      setErrorMessage(`Failed to download ${name}: ${error.message}`);
    } finally {
      setFileTransferProgress(null);
    }
  }

  async function handleFileDelete(name) {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const success = await actor.deleteFile(name);
        if (success) {
          await loadFiles();
        } else {
          setErrorMessage('Failed to delete file');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        setErrorMessage(`Failed to delete ${name}: ${error.message}`);
      }
    }
  }

  if (!isAuthenticated) {return (<button onClick={login} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
    Login with Internet Identity
  </button>) }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Secure Documents
            </h1>
            <p className="text-muted-foreground mt-1">
              Your therapy & tounseling records are securely stored on the
              blockchain
            </p>
          </div>
          <div>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-md border border-red-400 bg-red-100 p-3 text-red-700">{errorMessage}</div>
          )}

          {fileTransferProgress && (
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">
                {`${fileTransferProgress.mode} ${fileTransferProgress.fileName} ... ${fileTransferProgress.progress}%`}
              </p>
            </div>
          )}
          </div>
        </div>
          <button onClick={logout} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Logout
          </button>
      </div>

        <div>
        {files.length === 0 ? (
              <p className="py-8 text-center text-gray-500">You have no files. Upload some!</p>
            ) : (
              files.map((file) => (
            <Card key={file.name} className="mb-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{file.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    Secured
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>this document is stored in blockchain</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant={"outline"} size={"sm"} onClick={() => handleFileDownload(file.name)}>
                  Download
                </Button>
                <Button variant={"destructive"} size={"sm"} onClick={() => handleFileDelete(file.name)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
                        ))
                      )}
        </div>
      </motion.div>
    </div>
  );
}
