import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface NewNoteCardProps {
  onNoteCreated: (content: string, title: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [notesContent, setNotesContent] = useState({
    content: "",
    title: "",
  });

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChanged(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { value, name } = e.target;

    setNotesContent({
      ...notesContent,
      [name]: value,
    });

    if (value === "" && name !== "title") setShouldShowOnBoarding(true);
  }

  function handleSaveNote(e: React.FormEvent) {
    e.preventDefault();
    const { content, title } = notesContent;

    if (content === "") return;

    onNoteCreated(content, title);

    setNotesContent({ content: "", title: "" });
    setShouldShowOnBoarding(true);

    toast.success("Nota criada com sucesso!");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.info("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1; // o número maximo de palavras que não foram reconhecidas - ao não identificar palavras complexas
    speechRecognition.interimResults = true; // trazendo resultados enquanto fala

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setNotesContent({
        title: notesContent.title,
        content: transcription,
      });
    };

    speechRecognition.onerror = (event) => {
      console.log(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    setShouldShowOnBoarding(true);

    if (speechRecognition !== null) speechRecognition.stop();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 space-y-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  {" "}
                  Comece{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                  >
                    {" "}
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <>
                  <input
                    className="w-full bg-transparent text-1xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
                    name="title"
                    value={notesContent.title}
                    onChange={handleContentChanged}
                    placeholder="Adicione um título"
                  />
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    name="content"
                    value={notesContent.content}
                    onChange={handleContentChanged}
                  />
                </>
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                onClick={handleSaveNote}
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
