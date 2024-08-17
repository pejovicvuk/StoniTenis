CREATE PROCEDURE [dbo].[InsertRezervacija]
    @Korisnici_id int,
    @Pocetak time,
    @Kraj time,
    @Datum date,
    @StalnaRezervacija bit,
    @Zavrseno bit
AS
BEGIN
    -- Check for overlapping reservations
    IF NOT EXISTS (
        SELECT 1
        FROM Rezervacije
        WHERE Datum = @Datum
          AND (
                (Pocetak <= @Pocetak AND Kraj > @Pocetak) -- Overlaps with the start time
             OR (Pocetak < @Kraj AND Kraj >= @Kraj)       -- Overlaps with the end time
             OR (@Pocetak <= Pocetak AND @Kraj >= Kraj)   -- Fully encapsulates an existing reservation
          )
    )
    BEGIN
        -- Insert the reservation if no overlap is found
        INSERT INTO Rezervacije (korisnici_id, pocetak, kraj, datum, stalna_rezervacija, zavrseno)
        VALUES (@Korisnici_id, @Pocetak, @Kraj, @Datum, @StalnaRezervacija, @Zavrseno)
    END
END
