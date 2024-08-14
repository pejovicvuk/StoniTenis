CREATE PROCEDURE [dbo].[InsertRezervacija]
	@Korisnici_id int,
	@Pocetak time,
	@Kraj time,
	@Datum date,
	@StalnaRezervacija bit,
	@Zavrseno bit
AS
begin
	insert into Rezervacije(korisnici_id, pocetak, kraj, datum, stalna_rezervacija, zavrseno)
	values (@Korisnici_id, @Pocetak, @Kraj, @Datum, @StalnaRezervacija, @Zavrseno)
end