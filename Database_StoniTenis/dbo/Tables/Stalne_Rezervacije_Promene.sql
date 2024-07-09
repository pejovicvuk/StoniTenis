CREATE TABLE [dbo].[Stalne_Rezervacije_Promene] (
    [Stalne_Rezervacije_id] INT         NOT NULL,
    [datum_promene]         DATE        NOT NULL,
    [stanje]                VARCHAR (1) NOT NULL,
    [novi_pocetak]          TIME (7)    NOT NULL,
    [novi_kraj]             TIME (7)    NOT NULL,
    CONSTRAINT [PK_13] PRIMARY KEY CLUSTERED ([Stalne_Rezervacije_id] ASC, [datum_promene] ASC),
    CONSTRAINT [FK_13] FOREIGN KEY ([Stalne_Rezervacije_id]) REFERENCES [dbo].[Stalne_Rezervacije] ([id])
);

