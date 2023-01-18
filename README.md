# Framework for AE Scripts

Este é um conjunto de funções para auxiliar na criação de scripts para o After Effects.

## Instalação
Para instalar este pacote, você pode baixar o arquivo "framework.jsx" e incluir ele no seu script com o comando @include ou importar ele como arquivo externo.

## Funções

### getFrame()
Esta função retorna um objeto com as informações sobre a composição ativa e as camadas selecionadas. O objeto tem as seguintes propriedades:
- `comp`: a composição ativa
- `select`: as camadas selecionadas
- `sel`: um array de objetos com as propriedades de transformação das camadas selecionadas (posição, rotação, escala, opacidade e ponto de ancoragem)

### changeName(lays, base, init, count)
Esta função renomeia as camadas fornecidas com base no nome base fornecido, com um contador iniciando no valor fornecido (padrão 1) e incrementando de acordo com o valor fornecido (padrão 1).

### setProp(lays, prop, val)
Esta função aplica um valor para a propriedade especificada (prop) em todas as camadas fornecidas (lays).

### setMethod(lays, prop, method, val)
Esta função aplica um método especificado (method) para a propriedade especificada (prop) em todas as camadas fornecidas (lays) e passa os argumentos fornecidos (val) para o método.

