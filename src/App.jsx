import { useState } from 'react'
import './App.css'
import { HfInference } from "@huggingface/inference";

function App() {

  const [filePath, setFilePath] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    console.log("filepath", e.target.files[0])
    setFilePath(e.target.files[0])
  }

  const fileLoaded = async (e) => {
    setLoading(true); // start loading

    const result = e.target.result;
    const hf_key = import.meta.env.VITE_HF;
    const client = new HfInference(hf_key);
    const data = new Blob([result], { type: "audio/wav" });

    try {
      const output = await client.automaticSpeechRecognition({
        data,
        model: "openai/whisper-large-v3",
        provider: "hf-inference",
      });

      if (output) {
        setText(output.text);
      } else {
        setText("Not able to transcribe at the moment. Please try later.");
      }

    } catch (error) {
      console.error("Error", error);
      setText(error.message);
    } finally {
      setLoading(false); // stop loading
    }
  };


  const handleFileUpload = async (e) => {

    const reader = new FileReader()

    reader.addEventListener("load", fileLoaded)

    reader.readAsArrayBuffer(filePath)

  }


  return (
    <div className='App'>
      <h1>Speech to Text</h1>
      <input type='file' accept='audio/*' onChange={handleFileChange} />
      {filePath && <p className="file-name">Selected file: {filePath.name}</p>}
      <button type='submit' onClick={handleFileUpload}>Transcribe</button>
      {loading && <p className="loading">Transcribing... please wait ⏳</p>}
      <textarea value={text} placeholder='Transcribed text will appear here...'></textarea>
    </div>
  )
}

export default App
