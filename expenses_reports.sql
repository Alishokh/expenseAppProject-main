-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 23 Maj 2024, 11:59
-- Wersja serwera: 10.4.14-MariaDB
-- Wersja PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `expenses_reports`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `category` varchar(30) NOT NULL,
  `type` varchar(20) NOT NULL,
  `amount` float NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `expenses`
--

INSERT INTO `expenses` (`expense_id`, `title`, `category`, `type`, `amount`, `user_id`, `date`) VALUES
(3, 'atitle1', 'salary', 'income', 11, 31, '2024-05-22'),
(4, 'atitle2', 'car', 'charge', 1222, 31, '2024-05-14'),
(6, 'title3', 'food', 'charge', 1220, 31, '2024-05-15'),
(7, 'title4', 'food', 'charge', 10, 31, '2024-05-15'),
(8, 'title5', 'salary', 'income', 10, 31, '2024-05-15'),
(9, 'title6', 'food', 'charge', 0, 31, '2024-05-19'),
(10, 'title7', 'home', 'charge', 200, 31, '2024-05-17'),
(11, 'title8', 'restaurants', 'charge', 250, 31, '2024-05-12'),
(12, 'title9', 'home', 'charge', 200, 31, '2024-05-19'),
(13, 'title10', 'car', 'charge', 250, 31, '2024-05-19'),
(14, 'title11', 'home', 'charge', 200, 31, '2024-05-19'),
(15, 'title 12', 'car', 'charge', 250, 31, '2024-05-19'),
(16, 'Title 11', 'home', 'charge', 200, 31, '2024-05-19'),
(17, 'title 12', 'car', 'charge', 250, 31, '2024-05-16'),
(18, 'Title 11', 'home', 'charge', 200, 31, '2024-05-13'),
(19, 'title 12', 'car', 'charge', 250, 31, '2024-05-11'),
(20, 'test expense', 'salary', 'income', 12000, 31, '2024-05-11'),
(21, '23423', 'home', 'charge', 12, 31, '2024-05-19'),
(22, 'test expense 2', 'salary', 'income', 12222, 31, '2024-05-19'),
(23, 'test expense', 'salary', 'income', 12000, 31, '2024-05-20'),
(25, 'exspense', 'salary', 'income', 1000, 31, '2024-05-21'),
(34, '23423', 'home', 'charge', 12, 31, '2024-05-14'),
(35, 'test expense', 'home', 'charge', 500, 31, '2024-05-14'),
(40, '23423', 'home', 'charge', 12, 31, '2024-05-15'),
(41, '23423', 'home', 'charge', 25, 31, '2024-05-15'),
(42, '23423', 'home', 'charge', 12, 31, '2024-05-31');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `logged_in` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `logged_in`) VALUES
(31, 'expense test', 'expenseApp@gmail.com', '12345678', 1),
(32, 'Władysław Kurczenko', 'vladkurr7890@gmail.com2', '1111111111111111111', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT dla tabeli `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
