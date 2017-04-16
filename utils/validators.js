/**
 * Arquivo: validators.js
 * Descrição: Facilitadores de Acoes
 * Author: Fabio de Assis
 * Data de Criação: 15/04/2017
 */

module.exports = {
  /**
   * Verifica se a String é um email válido
   * @param email<string>
   * @returns {boolean}
   */
  isEmail: function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
};