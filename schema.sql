USE remind_db;
GO

drop table if exists tasks;
GO

CREATE TABLE Tasks (
    TaskID INT IDENTITY (1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(100) NOT NULL,
    XCoordinate INT NOT NULL DEFAULT 0,
    YCoordinate INT NOT NULL DEFAULT 0
)