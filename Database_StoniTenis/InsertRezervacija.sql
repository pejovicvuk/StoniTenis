CREATE PROCEDURE InsertRezervacija
    @Korisnici_id int,
    @Pocetak time,
    @Kraj time,
    @Datum date,
    @StalnaRezervacija bit,
    @Zavrseno bit,
    @NewID int OUTPUT
AS
BEGIN
    INSERT INTO Rezervacije (korisnici_id, pocetak, kraj, datum, stalna_rezervacija, zavrseno)
    VALUES (@Korisnici_id, @Pocetak, @Kraj, @Datum, @StalnaRezervacija, @Zavrseno);

    SET @NewID = SCOPE_IDENTITY();
END
