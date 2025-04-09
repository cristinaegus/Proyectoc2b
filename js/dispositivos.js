let calculadora = {
  sumar: function (a, b) {
    if (this.comprobar_num(a) && this.comprobar_num(b)) {
      return a + b;
    } else {
      return false;
    }
  },
  restar(a, b) {
    if (this.comprobar_num(a) && this.comprobar_num(b)) {
      return a - b;
    } else {
      return false;
    }
  },
  multiplicar: function (a, b) {
    if (this.comprobar_num(a) && this.comprobar_num(b)) {
      return a * b;
    } else {
      return false;
    }
  },
  dividir(a, b) {
    if (this.comprobar_num(a) && this.comprobar_num(b)) {
      return a / b;
    } else {
      return false;
    }
  },
  modulo(a, b) {
    if (this.comprobar_num(a) && this.comprobar_num(b)) {
      return a % b;
    } else {
      return false;
    }
  },
  comprobar_num(num) {
    if (isNaN(num) || !isFinite(num)) {
      window.alert("Introduce correctamente el número");
      return false;
    } else {
      return true;
    }
  },
};
