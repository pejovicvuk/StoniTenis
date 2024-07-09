CREATE TABLE [dbo].[Specijalno_Vreme] (
    [lokal_id]         INT      NOT NULL,
    [datum]            DATE     NOT NULL,
    [otvoreno]         BIT      NOT NULL,
    [vreme_otvaranja]  TIME (7) NOT NULL,
    [vreme_zatvaranja] TIME (7) NOT NULL,
    CONSTRAINT [PK_6] PRIMARY KEY CLUSTERED ([lokal_id] ASC, [datum] ASC),
    CONSTRAINT [FK_4] FOREIGN KEY ([lokal_id]) REFERENCES [dbo].[Lokal] ([id])
);

