'use client';

import React, { useState } from 'react';
import { TaxInputs } from '../types';

interface SalaryFormProps {
  onCalculate: (inputs: TaxInputs) => void;
}

export const SalaryForm: React.FC<SalaryFormProps> = ({ onCalculate }) => {
  const [grossSalary, setGrossSalary] = useState<string>('36000');
  const [pays, setPays] = useState<12 | 14>(14);
  const [region, setRegion] = useState<string>('Madrid');
  const [familySituation, setFamilySituation] = useState<'single' | 'married' | 'single_parent'>('single');
  const [childrenCount, setChildrenCount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNumber = Number(grossSalary);

    if (!grossSalary || isNaN(salaryNumber) || salaryNumber <= 0) {
      alert('Por favor, introduce un salario bruto válido.');
      return;
    }

    onCalculate({
      grossSalary: salaryNumber,
      pays,
      region,
      familySituation,
      childrenCount: Number(childrenCount) || 0,
      disabilityDegree: 0,
      spouseSituation: 'income_over_1500',
      geographicMobility: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salario bruto anual (€)</label>
        <input
          type="number"
          value={grossSalary}
          onChange={(e) => setGrossSalary(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
          placeholder="Ej. 36000"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de pagas</label>
          <select
            value={pays}
            onChange={(e) => setPays(Number(e.target.value) as 12 | 14)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value={12}>12 pagas</option>
            <option value={14}>14 pagas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comunidad autónoma</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="Madrid">Madrid</option>
            <option value="Andalucia">Andalucía</option>
            <option value="Cataluna">Cataluña</option>
            <option value="ComunidadValenciana">Comunidad Valenciana</option>
            <option value="Galicia">Galicia</option>
            <option value="CastillaLeon">Castilla y León</option>
            <option value="PaísVasco">País Vasco</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Situación familiar</label>
          <select
            value={familySituation}
            onChange={(e) => setFamilySituation(e.target.value as any)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="single">Soltero/a</option>
            <option value="married">Casado/a</option>
            <option value="single_parent">Monoparental</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de hijos</label>
          <input
            type="number"
            min="0"
            value={childrenCount}
            onChange={(e) => setChildrenCount(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition cursor-pointer"
      >
        Calcular estimación
      </button>
    </form>
  );
};