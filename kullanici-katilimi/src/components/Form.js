import React from "react";
import { useState } from "react";
import axios from "axios";
import * as yup from "yup";

const formSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name should contain at least 2 characters.")
    .required("Name is required."),
  surname: yup
    .string()
    .min(2, "Surame should contain at least 2 characters.")
    .required("Surame is required."),
  email: yup
    .string()
    .email()
    .required("Mail is required")
    .notOneOf(
      ["waffle@syrup.com"],
      "This email has already been added before."
    ),
  password: yup
    .string()
    .min(6, "Password should contain at least 6 characters.")
    .required("Password is required."),
  terms: yup.mixed().oneOf([true], "You must accept the terms of service."),
});

export default function Form() {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    terms: false,
  });

  const [registeredUser, setRegisteredUser] = useState([]);

  function handleChange(event) {
    const { checked, name, value, type } = event.target;
    let newValue = type === "checkbox" ? checked : value;

    setUser({ ...user, [name]: newValue });
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/users", user)
      .then((response) => setRegisteredUser(response.data))
      .catch((error) => console.log("Error!", error));
  }

  return (
    <div className="FormContainer">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            value={user.surname}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="terms"
            value={user.terms}
            onChange={handleChange}
            checked={user.terms}
          />
          I agree to the terms and conditions as set out by the user agreement.
        </label>
      </form>
      <button type="submit">SUBMIT</button>
    </div>
  );
}
