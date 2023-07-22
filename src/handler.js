const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    return response.code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });

  return response.code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const filteredBooks = books.filter((book) => {
    const checkName = name
      ? book.name.toLowerCase().includes(name.toLowerCase())
      : true;
    const checkReading = reading ? book.reading === !!Number(reading) : true;
    const checkFinished = finished
      ? book.finished === !!Number(finished)
      : true;

    return checkName && checkReading && checkFinished;
  });

  const response = h.response({
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response.code(200);
};

const getOneBookHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });

    return response.code(404);
  }

  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });

  return response.code(200);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    return response.code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });

    return response.code(404);
  }

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });

  return response.code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });

    return response.code(404);
  }

  books.splice(index, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });

  return response.code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getOneBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
