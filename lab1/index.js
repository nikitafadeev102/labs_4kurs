express = require("express")
const app = express();

app.set("view engine", "pug")

const myLogger = (req, res, next) => {
    console.log("L");
    next()
}

const requestTime = (req, res, next) => {
    req.requestTime = Date.now()
    next()
}

app.use(requestTime)
app.use(myLogger)

app.use("/static", express.static(__dirname + "/public"))

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.get("/", (req, res) => {
    res.render("main")
})

app.get("/faq", (req, res) =>  {
    res.render("faq", { age: "15 лет" })
})

app.get("/blogs", (req, res) => {
    res.render("blogs", {})
})

const todo = [
    {
        Id: 0,
        Title: "Задача 1",
        Completed: false
    },
    {
        Id: 1,
        Title: "Задача 2",
        Completed: true
    }
]

app.get("/todo", (req, res) => {
    res.render("todolist", {
        todolist: todo
    })
})

app.post("/todo/complete", (req, res) => {
    // todo.find((todo) => todo.Id === )
    res.redirect("/todo/");
})

app.post("/", (req, res) => {
    res.send("Got a POST request");
});


app.put("/user", (req, res) => {
    res.send("Got a PUT request at /user");
});

app.delete("/user", (req, res) => {
    res.send("Got a DELETE request at /user");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});