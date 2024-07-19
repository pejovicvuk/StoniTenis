CREATE PROCEDURE PostaniVlasnik
    @id int
AS
BEGIN
    UPDATE Korisnici
    SET vlasnik = 1
    WHERE id = @id;
END;
