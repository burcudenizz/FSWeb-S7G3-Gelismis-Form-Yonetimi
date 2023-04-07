/// <reference types="cypress" />

const passingName = "Dobby";
const passingSurname = "DobbySur";
const passingEmail = "dobby@dobby.com";
const passingPassword = "1234567";
const failingPassword = "123a";
const failingEmail = "dobby@dobbycom";
const initalListLength = 0;

describe("form yükleniyor", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("form elamanlarının hepsi ekranda", () => {
    cy.get("button[type=submit]").should("be.visible");
    cy.get("button[type=reset]").should("be.visible");
    cy.get("input").should("have.length", 5);
  });
  it("hatasız giriş yapınca,üye listesine ekleniyor.", () => {
    cy.get("input[name=name]").type(passingName);
    cy.get("input[name=email]").type(passingSurname);
    cy.get("input[name=email]").type(passingName);
    cy.get("input[name=password]").type(passingPassword);
    cy.get("input[name=terms]").click();
    cy.get('button[type="submit"]').should("not.be.disabled").click();
    cy.get(".FormContainer").should("exist");
    cy.get(".FormContainer").should("have.length", initalListLength + 1);
  });

  it("sadece isim boşken form gönderilmiyor", () => {
    cy.get("input[name=name]").type("isim");
    cy.get("input[name=name]").clear();
    cy.get("input[name=email]").type(passingEmail);
    cy.get("input[name=password]").type(passingPassword);
    cy.get("input[name=terms]").click();
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("İsim boş olunca hata mesajı görüntüleniyor", () => {
    cy.get("input[name=name]").type("isim");
    cy.get("input[name=name]").clear();
    cy.get("input[name=name]+div.field-error").should("be.visible");
    cy.get("input[name=name]+div.field-error").should(
      "have.text",
      "Name should contain at least 2 characters."
    );
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("Soyisim hatalı geçilince hata mesajı görüntüleniyor", () => {
    cy.get("input[name=surname]").type("s");
    cy.get("input[name=surname]").click();
    cy.get("input[name=surname]+div.field-error").should("be.visible");
    cy.get("input[name=surname]+div.field-error").should(
      "have.text",
      "Surname should contain at least 2 characters."
    );
    cy.get('button[type="submit"]').should("not.be.disabled");
  });

  it("Email hatalı olursa hata mesajı görüntüleniyor", () => {
    cy.get("input[name=email]").type("a");
    cy.get("input[name=email]").click();
    cy.get("input[name=email]+div.field-error").should(
      "have.text",
      "this must be a valid email"
    );
    cy.get('button[type="submit"]').should("not.be.disabled");
  });
});
