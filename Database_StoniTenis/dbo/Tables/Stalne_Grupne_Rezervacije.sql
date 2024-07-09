CREATE TABLE [dbo].[Stalne_Grupne_Rezervacije] (
    [stalna_rezervacija_id] INT NOT NULL,
    [stolovi_id]            INT NOT NULL,
    CONSTRAINT [PK_11] PRIMARY KEY CLUSTERED ([stalna_rezervacija_id] ASC, [stolovi_id] ASC),
    CONSTRAINT [FK_10] FOREIGN KEY ([stalna_rezervacija_id]) REFERENCES [dbo].[Stalne_Rezervacije] ([id]),
    CONSTRAINT [FK_11] FOREIGN KEY ([stolovi_id]) REFERENCES [dbo].[Stolovi] ([id])
);

