import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Markdown from "react-markdown";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [chatPrompt, setChatPrompt] = useState("What is the meaning of life?");
  const [response, setResponse] = useState("");

  const onSubmit = (values: any) => {
    setResponse("");
    fetch("/api/stream", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: values.message }),
    }).then(async (res) => {
      if (!res.body) {
        throw res.statusText;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const loopRunner = true;

      while (loopRunner) {
        // Here we start reading the stream, until its done.
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        setResponse((answer) => answer + decodedChunk);
      }
    });
  };

  return (
    <>
      <h1 style={{ margin: "0 auto", width: "fit-content" }}>
        Incident report summarisation
      </h1>
      <main
        className={`p-4 ${inter.className}`}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gridColumnGap: "2rem",
        }}
      >
        <div>
          <Formik
            initialValues={{ message: "" }}
            validate={(values) => {
              const errors: any = {};
              if (!values.message) {
                errors.message = "Required";
              }
              return errors;
            }}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  name="message"
                  as="textarea"
                  style={{
                    padding: "1rem",
                    border: "1px solid",
                    width: "100%",
                    height: 400,
                  }}
                />
                <ErrorMessage name="message" component="div" />
                <button
                  type="submit"
                  style={{
                    margin: "1rem",
                    background: "black",
                    borderRadius: ".5rem",
                    color: "white",
                    padding: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  {isSubmitting ? "Thinking..." : "Summarize"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div
          style={{
            maxWidth: 960,
            // overflowY: "scroll",
            // maxHeight: "80vh",
          }}
        >
          <Markdown>{response}</Markdown>
        </div>
        {/* {response && (
        <div>
          <button>Do a thing</button>
          <button>Do a thing</button>
        </div>
      )} */}
      </main>
    </>
  );
}
