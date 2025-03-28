-- Manual Seeding via SQL Script
-- Create a table of orders first:
CREATE TABLE IF NOT EXISTS orders (
    orderId INT PRIMARY KEY AUTO_INCREMENT,
    orderItem VARCHAR(255),
    orderDescription TEXT,
    orderDate DATE,
    student VARCHAR(255),
    tutor VARCHAR(255),
    subject VARCHAR(255),
    status VARCHAR(50),
    price DECIMAL(10, 2)
);

-- Insert data into the orders table
INSERT INTO orders (orderItem, orderDescription, orderDate, student, tutor, subject, status, price)
VALUES
    ('Math Tutoring Session', 'One-on-one tutoring session for algebra', '2025-03-25', 'Alice Johnson', 'John Doe', 'Mathematics', 'Completed', 50.00),
    ('English Essay Assistance', 'Help with writing and editing an essay for high school English', '2025-03-26', 'Bob Smith', 'Jane Taylor', 'English', 'Pending', 30.00),
    ('Physics Help', 'Physics homework help focusing on mechanics', '2025-03-27', 'Charlie Brown', 'David Lee', 'Physics', 'Pending', 45.00),
    ('History Review', 'Reviewing historical events for an upcoming exam', '2025-03-28', 'Diana Green', 'Emily White', 'History', 'Completed', 40.00),
    ('Chemistry Lab Session', 'Helping with laboratory work for organic chemistry', '2025-03-29', 'Eva Blue', 'Michael Scott', 'Chemistry', 'Pending', 60.00);

