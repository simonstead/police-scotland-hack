import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

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
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
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
                  width: 800,
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
      <p>{response}</p>
    </main>
  );
}
