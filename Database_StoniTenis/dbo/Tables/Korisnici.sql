CREATE TABLE [dbo].[Korisnici] (
    [id]    INT NOT NULL IDENTITY,
    [email] VARCHAR (MAX) NOT NULL,
    [vlasnik] BIT NOT NULL, 
    [Ime] VARCHAR (MAX) NOT NULL, 
    [Prezime] VARCHAR (MAX) NOT NULL, 
    CONSTRAINT [PK_2] PRIMARY KEY CLUSTERED ([id] ASC)
);

