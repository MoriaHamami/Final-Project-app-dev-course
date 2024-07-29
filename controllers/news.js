const newsService = require('../services/news');
const aboutService = require('../services/about');

const getNews = async (req, res) => {
  try {
    const news = await newsService.getNew();
    const coords = await aboutService.getCoords();
    coords.center = getCenterCoords(coords.data);
    res.render('news.ejs', { news, GOOGLE_KEY: process.env.GOOGLE_KEY, coords: coords });
  } catch (e) {
    console.log('שגיאה בשליפת חדשות:', e);
    res.status(500).json({ error: 'שגיאה בשליפת חדשות' });
  }
};

function getCenterCoords(coords) {
  let lats = 0;
  let longs = 0;
  let latsLength = 0;
  let longsLength = 0;
  for (let i = 0; i < coords.length; i++) {
    if (coords[i].lat) {
      lats += coords[i].lat;
      latsLength++;
    }
    if (coords[i].long) {
      longs += coords[i].long;
      longsLength++;
    }
  }

  const avgLat = latsLength ? lats / latsLength : 37.4220656;
  const avgLong = longsLength ? longs / longsLength : -122.0840897;

  return {
    lat: avgLat,
    long: avgLong
  };
}

const createNew = async (req, res) => {
  const { genre, txt, date } = req.body;
  try {
    const newArticle = await newsService.createNew(genre, txt, date);
    res.json(newArticle);
  } catch (e) {
    console.log('שגיאה ביצירת חדשות:', e);
    res.status(500).json({ error: 'שגיאה ביצירת חדשות' });
  }
};

const getNew = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.render('edit-news.ejs', { article: null });
    }

    const article = await newsService.getNewById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'מאמר לא נמצא' });
    }

    if (req.path.includes('edit')) {
      return res.render('edit-news.ejs', { article });
    } else {
      return res.redirect('/news');
    }
  } catch (e) {
    console.log('שגיאה בשליפת מאמר:', e);
    return res.status(500).json({ error: 'שגיאה בשליפת מאמר' });
  }
};

const updateNew = async (req, res) => {
  const id = req.params.id;
  const { genre, txt, date } = req.body;
  try {
    await newsService.updateArticle(id, genre, txt, date);
    res.json({ success: true, message: 'המאמר עודכן בהצלחה' });
  } catch (e) {
    console.log('שגיאה בעדכון מאמר:', e);
    res.status(500).json({ error: 'שגיאה בעדכון מאמר' });
  }
};

const deleteNew = async (req, res) => {
  try {
    const article = await newsService.deleteArticle(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'מאמר לא נמצא' });
    }
    res.json({ success: true, message: 'המאמר נמחק בהצלחה' });
  } catch (e) {
    console.log('שגיאה במחיקת מאמר:', e);
    res.status(500).json({ error: 'שגיאה במחיקת מאמר' });
  }
};

const searchNews = async (req, res) => {
  const { genre, text } = req.query;

  try {
    const query = {};
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    if (text) {
      query.txt = { $regex: text, $options: 'i' };
    }

    const news = await newsService.searchNews(query);

    // Render only the #newsResults part
    res.render('news', { news, coords: req.coords, GOOGLE_KEY: process.env.GOOGLE_KEY, layout: false });
  } catch (e) {
    console.log('Error searching news:', e);
    res.status(500).json({ error: 'Error searching news' });
  }
};




module.exports = {
  getNews,
  createNew,
  getNew,
  updateNew,
  deleteNew,
  searchNews
};
