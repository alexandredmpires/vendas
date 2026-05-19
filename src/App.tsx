/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { AlertTriangle, Store, MapPin, Package, Users, TrendingUp, Search } from "lucide-react";

// Exemplo de dados.
const vendasExemplo = [
  { vendedor: "Ana Silva", regiaoVendedor: "Norte", regiaoVenda: "Norte", pontoVenda: "Loja Porto", produto: "Produto A", quantidade: 120, valor: 15400 },
  { vendedor: "Joao Mendes", regiaoVendedor: "Centro", regiaoVenda: "Centro", pontoVenda: "Loja Coimbra", produto: "Produto B", quantidade: 98, valor: 12100 },
  { vendedor: "Carla Rocha", regiaoVendedor: "Sul", regiaoVenda: "Sul", pontoVenda: "Loja Faro", produto: "Produto C", quantidade: 88, valor: 10850 },
  { vendedor: "Miguel Costa", regiaoVendedor: "Norte", regiaoVenda: "Centro", pontoVenda: "Loja Aveiro", produto: "Produto A", quantidade: 76, valor: 9400 },
  { vendedor: "Rita Gomes", regiaoVendedor: "Lisboa", regiaoVenda: "Lisboa", pontoVenda: "Loja Lisboa", produto: "Produto D", quantidade: 64, valor: 8200 },
  { vendedor: "Pedro Lopes", regiaoVendedor: "Sul", regiaoVenda: "Norte", pontoVenda: "Loja Braga", produto: "Produto E", quantidade: 42, valor: 5100 },
  { vendedor: "Sofia Martins", regiaoVendedor: "Centro", regiaoVenda: "Centro", pontoVenda: "Loja Leiria", produto: "Produto B", quantidade: 39, valor: 4700 },
  { vendedor: "Tiago Ferreira", regiaoVendedor: "Lisboa", regiaoVenda: "Lisboa", pontoVenda: "Loja Cascais", produto: "Produto F", quantidade: 31, valor: 3900 }
];

interface Agregado {
  nome: string;
  quantidade: number;
  valor: number;
  registos: number;
}

function agruparPor(dados: any[], chave: string): Agregado[] {
  const mapa = new Map<string, Agregado>();

  dados.forEach((linha) => {
    const nome = linha[chave] || "Sem informação";
    const atual = mapa.get(nome) || { nome, quantidade: 0, valor: 0, registos: 0 };
    atual.quantidade += Number(linha.quantidade || 0);
    atual.valor += Number(linha.valor || 0);
    atual.registos += 1;
    mapa.set(nome, atual);
  });

  return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(valor || 0);
}

function formatarNumero(valor: number) {
  return new Intl.NumberFormat("pt-PT").format(valor || 0);
}

function RankingTable({ dados, titulo, icon: Icon }: { dados: Agregado[], titulo: string, icon: any }) {
  return (
    <Card className="rounded-[40px] shadow-lg border-none bg-white overflow-hidden flex flex-col ring-1 ring-black/5">
      <div className="p-6 border-b border-[#F0F0E8] flex justify-between items-center bg-[#FBFBFA]">
        <h2 className="text-xl font-serif font-medium text-[#1A1A18] flex items-center gap-2">
          <span className="italic">{titulo.split(' ')[0]}</span> de <span className="italic">{titulo.split(' ').slice(1).join(' ')}</span>
        </h2>
        <div className="flex bg-[#EBEBE0] p-1 rounded-xl">
           <Badge variant="ghost" className="bg-white text-[#5A5A40] rounded-lg text-[10px] font-bold shadow-sm px-3 py-1 uppercase translate-y-0">TOP</Badge>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-[#FBFBFA] sticky top-0">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-[#8E8E85] uppercase tracking-widest italic">Posição</th>
              <th className="px-8 py-4 text-[10px] font-bold text-[#8E8E85] uppercase tracking-widest italic">Nome</th>
              <th className="px-8 py-4 text-[10px] font-bold text-[#8E8E85] uppercase tracking-widest italic font-mono">Qtd</th>
              <th className="px-8 py-4 text-right text-[10px] font-bold text-[#8E8E85] uppercase tracking-widest italic font-serif">Valor Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0E8]">
            {dados.map((item, index) => (
              <tr key={item.nome} className="hover:bg-[#FBFBFA] transition-colors">
                <td className="px-8 py-5 text-sm font-serif font-bold text-[#5A5A40] italic">{(index + 1).toString().padStart(2, '0')}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBEBE0] flex items-center justify-center text-[10px] font-bold text-[#5A5A40]">
                      {item.nome.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium">{item.nome}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-mono text-[#8E8E85]">{formatarNumero(item.quantidade)}</td>
                <td className="px-8 py-5 text-right font-serif font-bold text-[#1A1A18]">{formatarMoeda(item.valor)}</td>
              </tr>
            ))}
            {dados.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-[#8E8E85] italic font-serif">
                  Nenhum dado disponível.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function KpiCard({ titulo, valor, detalhe, icon: Icon }: { titulo: string, valor: string | number, detalhe: string, icon: any }) {
  return (
    <Card className="bg-white p-5 rounded-[32px] shadow-sm border-none ring-1 ring-black/5 flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-[#EBEBE0] flex items-center justify-center text-[#5A5A40] group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] text-[#8E8E85] font-bold uppercase tracking-wider">{titulo}</p>
        <p className="text-2xl font-serif font-bold text-[#1A1A18]">{valor}</p>
        <p className="text-[10px] text-[#8E8E85] italic">{detalhe}</p>
      </div>
    </Card>
  );
}

export default function DashboardVendas() {
  const [dados] = useState(vendasExemplo);
  const [pesquisa, setPesquisa] = useState("");
  const [regiao, setRegiao] = useState("todas");

  const regioes = useMemo(() => {
    return ["todas", ...Array.from(new Set(dados.map((v) => v.regiaoVenda).filter(Boolean)))];
  }, [dados]);

  const dadosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return dados.filter((linha) => {
      const passaRegiao = regiao === "todas" || linha.regiaoVenda === regiao;
      const texto = `${linha.vendedor} ${linha.pontoVenda} ${linha.produto} ${linha.regiaoVenda}`.toLowerCase();
      const passaPesquisa = !termo || texto.includes(termo);
      return passaRegiao && passaPesquisa;
    });
  }, [dados, pesquisa, regiao]);

  const vendedores = useMemo(() => agruparPor(dadosFiltrados, "vendedor"), [dadosFiltrados]);
  const pontosVenda = useMemo(() => agruparPor(dadosFiltrados, "pontoVenda"), [dadosFiltrados]);
  const regioesRanking = useMemo(() => agruparPor(dadosFiltrados, "regiaoVenda"), [dadosFiltrados]);
  const produtos = useMemo(() => agruparPor(dadosFiltrados, "produto"), [dadosFiltrados]);

  const anomaliasRegiao = useMemo(() => {
    return dadosFiltrados.filter((linha) => linha.regiaoVendedor && linha.regiaoVenda && linha.regiaoVendedor !== linha.regiaoVenda);
  }, [dadosFiltrados]);

  const totalVendas = dadosFiltrados.reduce((soma, linha) => soma + Number(linha.valor || 0), 0);
  const totalQuantidade = dadosFiltrados.reduce((soma, linha) => soma + Number(linha.quantidade || 0), 0);
  const melhorVendedor = vendedores[0];
  const melhorProduto = produtos[0];

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-6 md:p-10 text-[#343432] font-sans selection:bg-[#5A5A40]/10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 bg-[#5A5A40] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Dashboard Executivo</span>
            <h1 className="text-4xl font-serif font-light text-[#1A1A18] lg:text-6xl">
              Análise de <span className="italic font-medium text-[#5A5A40]">Vendas</span>
            </h1>
            <p className="text-[#8E8E85] font-serif italic text-lg leading-relaxed">
              Performance comercial e detecção de padrões geográficos na rede de retalho.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E85] group-focus-within:text-[#5A5A40] transition-colors" />
              <Input
                className="pl-10 h-12 bg-white border-none rounded-2xl shadow-sm ring-1 ring-black/5 focus-visible:ring-[#5A5A40] outline-none text-sm w-full sm:w-72"
                placeholder="Pesquisar vendedor ou loja..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>

            <Select value={regiao} onValueChange={setRegiao}>
              <SelectTrigger className="h-12 bg-[#5A5A40] text-white px-5 rounded-2xl flex items-center gap-2 text-sm font-medium shadow-md hover:bg-[#4a4a35] border-none focus:ring-offset-0 focus:ring-0">
                   <SelectValue placeholder="Todas as Regiões" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl">
                {regioes.map((r) => (
                  <SelectItem key={r} value={r} className="rounded-lg focus:bg-[#F5F5F0]">
                    {r === "todas" ? "Todas as Regiões" : r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
           <KpiCard titulo="Total de Vendas" valor={formatarMoeda(totalVendas)} detalhe={`${formatarNumero(totalQuantidade)} unidades`} icon={TrendingUp} />
           <KpiCard titulo="Top Colaborador" valor={melhorVendedor?.nome?.split(' ')[0] || "---"} detalhe={`Ranking #1`} icon={Users} />
           <KpiCard titulo="Artigo Estrela" valor={melhorProduto?.nome || "---"} detalhe={`${formatarNumero(melhorProduto?.quantidade || 0)} vendidas`} icon={Package} />
           <KpiCard titulo="Desvio Geográfico" valor={anomaliasRegiao.length} detalhe="Alertas de anomalia" icon={AlertTriangle} />
        </div>

        <Tabs defaultValue="rankings" className="w-full">
          <div className="flex items-center justify-between mb-8 border-b border-[#EBEBE0] pb-4">
            <TabsList className="bg-[#EBEBE0] p-1 rounded-2xl h-auto">
              <TabsTrigger value="rankings" className="rounded-xl py-2 px-8 data-[state=active]:bg-white data-[state=active]:text-[#5A5A40] data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest text-[#8E8E85]">Rankings</TabsTrigger>
              <TabsTrigger value="analise" className="rounded-xl py-2 px-8 data-[state=active]:bg-white data-[state=active]:text-[#5A5A40] data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest text-[#8E8E85]">Dashboard Visual</TabsTrigger>
            </TabsList>
            
            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#8E8E85]">
              <div className="flex items-center gap-2"><div className="w-1.5 h-6 bg-[#5A5A40] rounded-full"></div> Período Atual</div>
            </div>
          </div>
          
          <TabsContent value="rankings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <RankingTable dados={vendedores} titulo="Ranking Vendedores" icon={Users} />
              <RankingTable dados={produtos} titulo="Volume Produtos" icon={Package} />
              <RankingTable dados={pontosVenda} titulo="Performance Lojas" icon={Store} />
              <RankingTable dados={regioesRanking} titulo="Divisões Norte/Sul" icon={MapPin} />
            </div>
          </TabsContent>

          <TabsContent value="analise" className="mt-0 space-y-10 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <Card className="lg:col-span-12 rounded-[40px] shadow-lg border-none bg-white p-8 ring-1 ring-black/5">
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-medium text-[#1A1A18] flex items-center gap-3">
                    <span className="w-2 h-8 bg-[#5A5A40] rounded-full"></span>
                    Performance por <span className="italic font-bold">Colaborador</span>
                  </h3>
                  <p className="text-sm text-[#8E8E85] mt-1 italic font-serif">Volume de transações filtradas por valor líquido</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendedores.slice(0, 8)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0E8" />
                      <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#343432', letterSpacing: '0.05em' }} dy={15} />
                      <YAxis tickFormatter={(val) => `€${val/1000}k`} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E85', fontWeight: 600 }} />
                      <Tooltip 
                        cursor={{ fill: '#F5F5F0' }}
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', background: 'white' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '800', color: '#5A5A40' }}
                        formatter={(val: number) => [formatarMoeda(val), 'Volume']}
                      />
                      <Bar dataKey="valor" fill="#5A5A40" radius={[12, 12, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-7 rounded-[40px] shadow-lg border-none bg-white p-8 ring-1 ring-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F5F0] rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
                 <div className="mb-10 ">
                    <h2 className="text-2xl font-serif font-medium text-[#1A1A18]">Quota de <span className="italic font-bold text-[#5A5A40]">Mercado</span></h2>
                    <p className="text-sm text-[#8E8E85] mt-1 font-serif italic">Distribuição regional de vendas</p>
                  </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regioesRanking}
                        dataKey="valor"
                        nameKey="nome"
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={130}
                        paddingAngle={8}
                      >
                        {regioesRanking.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#5A5A40', '#8E8E85', '#D6D1C5', '#B8B2A6', '#A39D90'][index % 5]} className="stroke-white stroke-2" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                        formatter={(val: number) => formatarMoeda(val)}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-5 bg-[#5A5A40] text-white p-8 rounded-[40px] shadow-xl border-none ring-1 ring-white/10 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/20 p-3 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-medium uppercase tracking-tight italic">Anomalias de Região</h3>
                </div>
                
                <p className="text-white/70 text-sm mb-8 font-serif leading-relaxed italic">
                  Vendas efectuadas fora da geografia logística base atribuída ao colaborador.
                </p>

                <div className="space-y-4 overflow-auto flex-1 pr-2 custom-scrollbar">
                  {anomaliasRegiao.map((a, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 group hover:bg-white/15 transition-colors">
                      <div className="flex justify-between items-start mb-2 text-white">
                        <div>
                          <p className="text-base font-bold tracking-tight">{a.vendedor}</p>
                          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{a.regiaoVendedor}</p>
                        </div>
                        <span className="text-[9px] bg-red-400 font-bold px-2 py-0.5 rounded-full uppercase">Cross-Region</span>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        <MapPin className="h-3 w-3 text-white/50" />
                        <p className="text-xs font-serif italic text-white/80">Operação em: <span className="text-white font-bold not-italic">{a.regiaoVenda}</span> ({a.pontoVenda})</p>
                      </div>
                    </div>
                  ))}
                  {anomaliasRegiao.length === 0 && (
                     <div className="bg-white/10 p-5 rounded-3xl border border-white/5 text-center py-12 opacity-50">
                        <p className="text-sm italic font-serif">Sem anomalias detectadas no período.</p>
                     </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

