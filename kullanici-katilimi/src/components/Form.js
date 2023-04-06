import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import RegisteredUser from "./RegisteredUser";

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
  const [buttonDisabledMi, setButtonDisabledMi] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    terms: "",
  });
  const handleReset = () => {
    setUser({
      name: "",
      surname: "",
      email: "",
      password: "",
      terms: "",
    });
    setErrors({
      name: "",
      surname: "",
      email: "",
      password: "",
      terms: "",
    });
  };
  const checkFormErrors = (name, value) => {
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [name]: err.errors[0],
        });
      });
  };
  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;
    setUser({ ...user, [name]: newValue });
    checkFormErrors(name, newValue);
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/users", user)
      .then((response) => setRegisteredUser([...registeredUser, response.data]))
      .catch((error) => console.log("Error!", error));
  }

  useEffect(() => {
    formSchema.isValid(user).then((response) => setButtonDisabledMi(!response));
  }, [user]);

  return (
    <div className="FormContainer">
      <form onSubmit={handleSubmit} buttonDisabledMi={buttonDisabledMi}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
          />
          {errors.name !== "" && (
            <div className="field-error">{errors.name}</div>
          )}
        </label>
        <label>
          Surname:
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={user.surname}
            onChange={handleChange}
          />
          {errors.surname !== "" && (
            <div className="field-error">{errors.surname}</div>
          )}
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email !== "" && (
            <div className="field-error">{errors.email}</div>
          )}
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
          {errors.password !== "" && (
            <div className="field-error">{errors.password}</div>
          )}
        </label>
        <label>
          <input
            type="checkbox"
            name="terms"
            value={user.terms}
            onChange={handleChange}
            checked={user.terms}
            class="larger"
          />
          I agree to the terms and conditions as set out by the user agreement.
        </label>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={buttonDisabledMi}
        >
          SUBMIT
        </button>
        <button type="reset" onClick={handleReset}>
          CLEAN
        </button>
      </form>
      <RegisteredUser registeredUser={registeredUser} />
    </div>
  );
}
