export async function getJSON(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error('Erro '+r.status);
  return r.json();
}
export async function postJSON(url, data){
  const r = await fetch(url,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(data)
  });
  if(!r.ok) throw new Error('Erro '+r.status);
  return r.json();
}
export async function viaCEP(cep){
  cep = cep.replace(/\D/g,'');
  const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const j = await r.json();
  if(j.erro) throw new Error('CEP inválido');
  return j;
}
