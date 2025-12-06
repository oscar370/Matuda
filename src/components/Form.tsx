import React, { FormHTMLAttributes } from "react";

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
};

export default function Form({ children, ...props }: FormProps) {
  return (
    <form action="" {...props}>
      {children}
    </form>
  );
}
