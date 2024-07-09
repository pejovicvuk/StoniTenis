CREATE TABLE [dbo].[Odradjeni_Termini]
(
    [id_rezervacije] INT NOT NULL,
    CONSTRAINT [PK_1] PRIMARY KEY ([id_rezervacije]),
    CONSTRAINT [FK_9_3] FOREIGN KEY ([id_rezervacije]) REFERENCES [dbo].[Rezervacije] ([id])
);
