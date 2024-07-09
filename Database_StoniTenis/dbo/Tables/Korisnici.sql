CREATE TABLE [dbo].[Korisnici] (
    [id]    INT         IDENTITY (0, 1) NOT NULL,
    [email] VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_2] PRIMARY KEY CLUSTERED ([id] ASC)
);

