CREATE PROCEDURE [dbo].[InsertKorisnik]
	@Email varchar(max),
	@Vlasnik bit,
	@Ime varchar(max),
	@Prezime varchar(max)
AS
begin
	insert into Korisnici(email, vlasnik, Ime, Prezime)
	values (@Email, @Vlasnik, @Ime, @Prezime)
end

