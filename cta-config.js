/* Konfiguracja przycisków CTA. Jedyne miejsce, które trzeba zmienić po podłączeniu sprzedaży.
   Klucz = wartość atrybutu data-cta w index.html. Wartość = adres docelowy.
   Wartości zaczynające się od "#checkout-todo" są placeholderami: kliknięcie pokazuje komunikat TODO
   zamiast przejścia dalej. Nie ma tu checkoutu ani integracji płatniczej (poza zakresem landing page).
   TODO: wpisać docelowe adresy (np. linki do zamówienia) po wyborze operatora płatności. */
window.SI_CTA = {
  "scroll-pricing": "#pakiety",
  "package-1": "#checkout-todo-pakiet-1",   // Wejście, 149 zł [DO POTWIERDZENIA]
  "package-2": "#checkout-todo-pakiet-2",   // Kompletny system, 499 zł [DO POTWIERDZENIA]
  "package-3": "#checkout-todo-pakiet-3"    // Premium, 999 zł [DO POTWIERDZENIA]
};
