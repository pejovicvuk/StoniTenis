CREATE TABLE [dbo].[Klub] (
    [id]         INT         IDENTITY (0, 1) NOT NULL,
    [korisnik_id] INT         NOT NULL,
    [Naziv]      VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_3] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_1] FOREIGN KEY ([korisnik_id]) REFERENCES [dbo].[Korisnici] ([id])
);

