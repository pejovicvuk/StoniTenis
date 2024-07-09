CREATE TABLE [dbo].[Grupne_Rezervacije] (
    [rezervacija_id] INT NOT NULL,
    [stolovi_id]     INT NOT NULL,
    CONSTRAINT [PK_9] PRIMARY KEY CLUSTERED ([rezervacija_id] ASC, [stolovi_id] ASC),
    CONSTRAINT [FK_7] FOREIGN KEY ([rezervacija_id]) REFERENCES [dbo].[Rezervacije] ([id]),
    CONSTRAINT [FK_8] FOREIGN KEY ([stolovi_id]) REFERENCES [dbo].[Stolovi] ([id])
);

