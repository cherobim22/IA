from random import Random
from time import time
from math import cos
from math import pi
from inspyred import ec
from inspyred.ec import terminators
import numpy as np
import os


def generate_(random, args):
    size = args.get('num_inputs', 2)
    return [random.randint(0, 800) for i in range(size)]


def evaluate_(candidates, args):
    fitness = []
    for cs in candidates:
        fit = perform_fitness(cs[0], cs[1])
        fitness.append(fit)
    return fitness


def perform_fitness(L, S):
    L = np.round(L)
    S = np.round(S)
    fit = float((5*L + 4.5*S) / 7375)
    h1 = np.maximum(0, float(((6*L + 5*S) / 100) - 60)) / 15
    h2 = np.maximum(0, float((10*L + 20*S) - 15000)) / 3750
    h3 = np.maximum(0, float(L - 800)) / 200
    h4 = np.maximum(0, float(S - 750)) / 187.5

    fit = fit - (h1 + h2 + h3 + h4)

    return fit


def solution_evaluation(L, S):
    L = np.round(L)
    S = np.round(S)
    print
    print("..:RESUMO DA PRODUÇÂO:..")
    print("Lucro Total", float(5*L + 4.5*5))
    print("Tempo de utilização semanal maquina (MAX 60h): ", float((6*L + 5*S) / 100))
    print("Espaço utilizado do deposito (MAX. 1500)", float(10*L + 20*S))
    print("Produção de Garrafas tipo LEITE produzidas (MAX. 800): ", L)
    print("Produção de garrafas do tipo SUCO produzidas (MAX .750): ", S)


def main():
    rand = Random()
    rand.seed(int(time()))

    ea = ec.GA(rand)
    ea.selector = ec.selectors.tournament_selection
    ea.variator = [ec.variators.uniform_crossover,
                   ec.variators.gaussian_mutation]
    ea.replacer = ec.replacers.steady_state_replacement

    ea.terminator = terminators.generation_termination

    ea.observer = [ec.observers.stats_observer, ec.observers.file_observer]

    final_pop = ea.evolve(generator=generate_,
                          evaluator=evaluate_,
                          pop_size=10000,
                          maximize=True,
                          bounder=ec.Bounder(0, 800),
                          max_generations=10000,
                          num_imputs=2,
                          crossover_rae=1.0,
                          num_crossover_points=1,
                          mutation_rate=0.25,
                          num_elites=1,
                          num_selected=2,
                          tournament_size=2,
                          statistics_file=open("garrafas_stats.csv", "w"),
                          individuals_file=open("garrafas_individuais.csv", "w"))

    final_pop.sort(reverse=True)
    print(final_pop[0])

    perform_fitness(final_pop[0].candidate[0], final_pop[0].candidate[1])
    solution_evaluation(final_pop[0].candidate[0], final_pop[0].candidate[1])


main()
