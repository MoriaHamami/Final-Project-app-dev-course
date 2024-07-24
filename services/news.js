const News = require('../models/news');

const createNew = async (genre, txt, date) => {
  const newArticle = new News({
    genre,
    txt,
    date
  });
  try {
    return await newArticle.save();
  } catch (e) {
    return e;
  }
};

const getNew = async () => {
  return await News.find({});
};

const getNewsByMonth = async (month) => {
  if (!month) {
    const allNews = await News.find({});
    return allNews;
  }

  const monthNews = [];
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const news = await News.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    monthNews.push(...news);
  }

  return monthNews;
};

const updateArticle = async (id, genre, txt, date) => {
  const article = await getNewById(id);

  if (!article) return null;

  if (genre) article.genre = genre;
  if (txt) article.txt = txt;
  if (date) article.date = date;

  try {
    await article.save();
    return article;
  } catch (e) {
    return e;
  }
};

const deleteArticle = async (id) => {
  try {
    const article = await News.findById(id);
    if (!article) {
      return null;
    }

    await article.deleteOne();
    return article;
  } catch (e) {
    return e;
  }
};

const getNewById = async (id) => {
  try {
    return await News.findById(id);
  } catch (error) {
    console.error('Error fetching article by id:', error);
    throw error;
  }
};

const searchNews = async (genre, text) => {
  const query = {};
  
  if (genre) {
    query.genre = { $regex: genre, $options: 'i' };
  }
  
  if (text) {
    query.txt = { $regex: text, $options: 'i' };
  }
  
  return await News.find(query);
};

module.exports = {
  createNew,
  getNew,
  getNewsByMonth,
  updateArticle,
  deleteArticle,
  getNewById,
  searchNews
};
