import { useRef, useState } from "react";
import { FiImage, FiMessageSquare, FiPlus, FiSend, FiX } from "react-icons/fi";
import AppLayout from "../layout/AppLayout";
import { apiRequest } from "../lib/api";

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const [, base64 = ""] = result.split(",");
      resolve(base64);
    };

    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      event.target.value = "";
      return;
    }

    try {
      const data = await readFileAsBase64(file);

      setSelectedImage({
        name: file.name,
        mimeType: file.type,
        data,
        previewUrl: URL.createObjectURL(file),
      });
      setError("");
    } catch (fileError) {
      setError(fileError.message);
    } finally {
      event.target.value = "";
    }
  }

  function removeSelectedImage() {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
  }

  async function sendMessage() {
    if ((!message.trim() && !selectedImage) || loading) {
      return;
    }

    const outgoingMessage = message.trim() || "Please analyze the uploaded image.";
    const uploadedImage = selectedImage;

    setError("");
    setLoading(true);
    setChat((current) => [
      ...current,
      {
        sender: "user",
        text: outgoingMessage,
        imagePreview: uploadedImage?.previewUrl || null,
        imageName: uploadedImage?.name || "",
      },
    ]);
    setMessage("");
    setSelectedImage(null);

    try {
      const data = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: outgoingMessage,
          image: uploadedImage
            ? {
                mimeType: uploadedImage.mimeType,
                data: uploadedImage.data,
              }
            : null,
        }),
      });

      setChat((current) => [...current, { sender: "bot", text: data.reply }]);
    } catch (requestError) {
      setError(requestError.message);
      setChat((current) => [
        ...current,
        { sender: "bot", text: "I hit a problem while fetching the reply. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <section className="soft-card p-7">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <FiMessageSquare size={19} />
            </span>
            <div>
              <h3 className="text-2xl font-black text-slate-950">Conversation</h3>
              <p className="text-sm text-slate-600">Ask questions, attach a screenshot or photo, and get one answer that uses both.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Text and image support are both available here now.
          </div>
        </div>

        <div className="mt-6 h-[34rem] space-y-4 overflow-y-auto rounded-[1.9rem] bg-slate-50/90 p-5">
          {chat.length === 0 && (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-5 py-12 text-center text-sm text-slate-500">
              Start the conversation with a money question, a suspicious screenshot, or both together.
            </div>
          )}

          {chat.map((msg, index) => (
            <div
              key={`${msg.sender}-${index}`}
              className={`max-w-3xl rounded-[1.6rem] px-4 py-4 text-sm leading-7 shadow-sm ${
                msg.sender === "user" ? "ml-auto bg-slate-950 text-white" : "bg-white text-slate-700"
              }`}
            >
              {msg.imagePreview && (
                <div className="mb-3 overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/5">
                  <img src={msg.imagePreview} alt={msg.imageName || "Uploaded"} className="max-h-72 w-full object-cover" />
                </div>
              )}
              {msg.text}
            </div>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {selectedImage && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-xl bg-white shadow-sm">
                <img src={selectedImage.previewUrl} alt={selectedImage.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedImage.name}</p>
                <p className="text-xs text-slate-600">This image will be sent with your next message.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeSelectedImage}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-800"
              aria-label="Remove selected image"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
            aria-label="Upload a photo"
          >
            <div className="flex items-center gap-1 text-lg font-semibold">
              <FiPlus size={16} />
              <FiImage size={16} />
            </div>
          </button>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows="3"
            className="min-h-[6.75rem] flex-1 rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-4 outline-none transition focus:border-emerald-500"
            placeholder="Ask a financial question or tell the coach what to look for in the uploaded image..."
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[10rem]"
          >
            <FiSend size={16} />
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </section>
    </AppLayout>
  );
}
