const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.listen(3000, () => {
      console.log("Сервер ожидает подключения на http://localhost:3000");
    });
    
app.get("/api/users/:id", (req, res) => {
      const id = req.params.id;
      const content = fs.readFileSync("users.json", "utf8");
      const users = JSON.parse(content);
    });
    
let user = null;

for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          user = users[i];
          console.log("🚀 ~ app.get ~ user:", user);
          break;
        }
      }
        
if (user) {
    res.json({ success: true, message: user });
  } else {
    res.status(404).json({ success: false, message: "" });
  }

app.post("/api/users", (req, res) => {
      const { name, age } = req.body;
    
      if (name == null || age == null) {
        res.status(404).json({ success: false, message: "Данные не заполнены" });
      }
    
      const data = fs.readFileSync("users.json", "utf8");
      const users = JSON.parse(data);
    const validateUser = (user) => {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        if (!nameRegex.test(user.name)) {
            throw new Error('Имя пользователя должно содержать только буквы и пробелы');
        }
        if (typeof user.age !== 'number' || user.age <= 0) {
            throw new Error('Возраст должен быть положительным числом');
        }
    };
    
      let user = { name, age };
    
      const id = Math.max.apply(
        Math,
        users.map((o) => {
          return o.id;
        }),
      );

      user.id = id + 1;
      users.push(user);
    
      const newData = JSON.stringify(users);
    
      fs.writeFileSync("users.json", newData);
    
      res.json({ success: true, message: user });
    });
    
app.delete("/api/users/:id", (req, res) => {
      const id = req.params.id;
    
      if (id == null || id == "") {
        res.status(404).json({ success: false, message: "Данные не заполнены" });
      }
    
      const data = fs.readFileSync("users.json", "utf8");
      const users = JSON.parse(data);
    
      let index = -1;
    
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          index = i;
          break;
        }
      }
    
      if (index > -1) {
        const user = users.splice(index, 1)[0];
    
        const data = JSON.stringify(users);
    
        fs.writeFileSync("users.json", data);
    
        res.json({ success: true, message: user });
      } else {
        res.status(404).json({ success: false, message: "Ошибка записи" });
      }
    });

app.put("/api/users", (req, res) => {
      const { name, age, id } = req.body;
    
      if (name == null || age == null || id == null) {
        res.status(404).json({ success: false, message: "Данные не заполнены" });
      }
    
      const data = fs.readFileSync("users.json", "utf8");
      const users = JSON.parse(data);
    
      let user;
    
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          user = users[i];
          break;
        }
      }
    
      if (user) {
        user.age = age;
        user.name = name;
    
        const newData = JSON.stringify(users);
    
        fs.writeFileSync("users.json", newData);
    
        res.json({ success: true, message: user });
      } else {
        res.status(404).json({ success: false, message: "Ошибка записи" });
      }
    });

    app.put('/api/users/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            validateUser(req.body);
            const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));
            const userIndex = users.findIndex(user => user.id === userId);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Пользователь не найден.' });
            }
            
            users[userIndex] = { ...users[userIndex], ...req.body };
            await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
            res.status(200).json(users[userIndex]);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
    
    app.post('/api/users', async (req, res) => {
        try {
            validateUser(req.body);
            const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));
            
            // Проверка уникальности имени
            const existingUser = users.find(user => user.name === req.body.name);
            if (existingUser) {
                return res.status(400).json({ error: 'Имя пользователя уже существует.' });
            }
            
            users.push(req.body);
            await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
            res.status(201).json(req.body);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    const logOperation = async (message) => {
        const logMessage = [${new Date().toISOString()}] ${message}\n;
        await fs.appendFile('./logs.txt', logMessage);
    };
    
    // Добавление пользователя с логом
    app.post('/api/users', async (req, res) => {
        try {
            validateUser(req.body);
            const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));
            
            const existingUser = users.find(user => user.name === req.body.name);
    if (existingUser) {
                return res.status(400).json({ error: 'Имя пользователя уже существует.' });
            }
            
            users.push(req.body);
            await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
            await logOperation(Добавлен пользователь: ${JSON.stringify(req.body)});
            res.status(201).json(req.body);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    const createBackup = async () => {
        await fs.copyFile(userFilePath, './users_backup.json');
    };
    
    // Обновление пользователя с резервной копией
    app.put('/api/users/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            validateUser(req.body);
            const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));
            const userIndex = users.findIndex(user => user.id === userId);
            
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Пользователь не найден.' });
            }
            
            await createBackup(); // Создаем резервную копию перед изменением
            users[userIndex] = { ...users[userIndex], ...req.body };
            await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
            await logOperation(Обновлен пользователь: ${JSON.stringify(users[userIndex])});
            res.status(200).json(users[userIndex]);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
    
    app.get('/api/users', async (req, res) => {
        try {
            const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));
            let filteredUsers = users;
    
            if (req.query.name) {
                filteredUsers = filteredUsers.filter(user => user.name.includes(req.query.name));
            }
            
            if (req.query.age) {
                filteredUsers = filteredUsers.filter(user => user.age === parseInt(req.query.age));
            }
    
            res.status(200).json(filteredUsers);
        } catch (err) {
            res.status(500).json({ error: 'Ошибка при получении пользователей.' });
        }
    });
    