const express = require("express");
const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.send("мяу");
});
app.post("/", (req, res) => {
  res.send("Got a POST request");
});
app.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});
app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

app.use("/contact", function (request, response) {
    response.render("contact", {
        title: "Мои контакты",
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890",
    });
});

app.set("view engine", "pug");

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});

