const newsService = require('../services/news');

const getNews = async (req, res) => {
  try {
    const news = await newsService.getNew();
    res.render('news.ejs', { news });
  } catch (e) {
    console.log('שגיאה בשליפת חדשות:', e);
    res.status(500).json({ error: 'שגיאה בשליפת חדשות' });
  }
};

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
    const news = await newsService.searchNews(genre, text);
    res.render('news.ejs', { news });
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
