var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { exec } = require('child_process');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для виконання команд CLI
app.get('/execute/:command', function(req, res) {
  const command = req.params.command;

  // Допустимі команди для відправки в Spotify CLI
  const commandMap = {
    'status': '--status',
    'song': '--song',
    'artist': '--artist',
    'playpause': '--playpause',
    'next': ' --next ',
    'prev': '--prev',
    'arturl': '--arturl' // Додаємо команду для отримання обкладинки
  };

  if (!commandMap[command]) {
    return res.status(400).json({ message: 'Неприпустима команда' });
  }

  // Виконання команди через Spotify CLI
  exec(`spotifycli ${commandMap[command]}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Помилка при виконанні команди: ${error.message}`);
      return res.status(500).json({ message: `Помилка виконання команди: ${error.message}` });
    }
    if (stderr) {
      console.error(`CLI помилка: ${stderr}`);
      return res.status(500).json({ message: `CLI помилка: ${stderr}` });
    }

    // Якщо команда для отримання обкладинки
    if (command === 'arturl') {

      return res.json({
        albumCover: stdout.trim() // Повертаємо URL обкладинки

      });
    }

    if (command === 'next') {}
    res.json({

    });


  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Сервер запущено на порту ${port}`);
});

module.exports = app;
