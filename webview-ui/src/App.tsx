import { vscode } from "./utilities/vscode";
import MainEditor from "./components/MainEditor";
import "./App.css";
import { useEffect, useState, useLayoutEffect } from "react";

function App() {
  const [content, setContent] = useState<JSON | null>(null)
  const [isVscode, setIsVscode] = useState(false)

  function updateContent(text: string) {
    console.log('updateContent');
    // console.log("content text = ", text);
    if (text) {
      setContent(JSON.parse(text));
    } else {
      setContent(null);
    }
  }

  const handleMessage = (event: any) => {
    const message = event.data;
    // console.log("App handleMessage() :", message)
    console.log("App handleMessage()");
    switch (message.type) {
      case 'update':
        const text = message.text;
        updateContent(text);
        vscode.setState({ text });
        return;
    }
  }

  useLayoutEffect(() => {
    console.log("window.addEventListener()");
    setIsVscode(vscode.isVscode());
    window.addEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if ((vscode.getState() as any)?.text) {
      updateContent((vscode.getState() as any).text);
    }
    return () => {
      console.log("window.removeEventListener()");
      window.removeEventListener('message', handleMessage);
    };
  }, []);


  function eidtor() {
    // console.log('isVscode', isVscode)
    return <>
      <MainEditor content={content} />
    </>
  }
  return (
    <>
      {
        // eidtor()
        (isVscode && content && eidtor()) || (!isVscode && eidtor())
      }
    </>
  )
}

export default App;