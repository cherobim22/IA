from random import Random
from time import time
from math import cos
from math import pi
from inspyred import ec
from inspyred.ec import terminators
import numpy as np
import os


def generate_(random, args):
    size = args.get('num_inputs', 12)
    return [random.randint(0, 16000) for i in range(size)]


def evaluate_(candidates, args):
    fitness = []
    for ca in candidates:
        fit = perform_fitness(ca[0], ca[1], ca[2], ca[3], ca[4], ca[5], ca[6], ca[7], ca[8], ca[9], ca[10], ca[11])
        fitness.append(fit)
    return fitness


def perform_fitness(C1_D, C1_C, C1_T, C2_D, C2_C, C2_T, C3_D, C3_C, C3_T, C4_D, C4_C, C4_T):
    C1_D = np.round(C1_D)
    C1_C = np.round(C1_C)
    C1_T = np.round(C1_T)

    C2_D = np.round(C2_D)
    C2_C = np.round(C2_C)
    C2_T = np.round(C2_T)

    C3_D = np.round(C3_D)
    C3_C = np.round(C3_C)
    C3_T = np.round(C3_T)

    C4_D = np.round(C4_D)
    C4_C = np.round(C4_C)
    C4_T = np.round(C4_T)

    # maximo do lucro conhecido do problema
    fit = float(((0.31 * C1_D + 0.31 * C1_C + 0.31 * C1_T) + (0.38 * C2_D + 0.38 * C2_C + 0.38 * C2_T) + (
                0.35 * C3_D + 0.35 * C3_C + 0.35 * C3_T) + (0.285 * C4_D + 0.285 * C4_C + 0.285 * C4_T)) / 12151.56)

    h1 = np.maximum(0, float((0.48 * C1_D + 0.65 * C2_D + 0.58 * C3_D + 0.39 * C4_D) - 6800)) / float(6800 / 13)
    h2 = np.maximum(0, float((C1_D + C2_D + C3_D + C4_D) - 10000)) / float(10000 / 13)
    h3 = np.maximum(0, float((0.48 * C1_C + 0.65 * C2_C + 0.58 * C3_C + 0.39 * C4_C) - 8700)) / float(8700 / 13)
    h4 = np.maximum(0, float((C1_C + C2_C + C3_C + C4_C) - 16000)) / float(16000 / 13)
    h5 = np.maximum(0, float((0.48 * C1_T + 0.65 * C2_T + 0.58 * C3_T + 0.39 * C4_T) - 5300)) / float(5300 / 13)
    h6 = np.maximum(0, float((C1_T + C2_T + C3_T + C4_T) - 8000)) / float(8000 / 13)
    h7 = np.maximum(0, float((C1_D + C1_C + C1_T) - 18000)) / float(18000 / 13)
    h8 = np.maximum(0, float((C2_D + C2_C + C2_T) - 15000)) / float(15000 / 13)
    h9 = np.maximum(0, float((C3_D + C3_C + C3_T) - 23000)) / float(23000 / 13)
    h10 = np.maximum(0, float((C4_D + C4_C + C4_T) - 12000)) / float(12000 / 13)

    total_cargas = 34000
    prop_dianteira = float(10000 / total_cargas)
    prop_central = float(16000 / total_cargas)
    prop_traseira = float(8000 / total_cargas)

    h11 = np.maximum(0, float(((C1_D + C2_D + C3_D + C4_D) / total_cargas) - prop_dianteira)) / float(
        prop_dianteira / 13)
    h12 = np.maximum(0, float(((C1_C + C2_C + C3_C + C4_C) / total_cargas) - prop_central)) / float(prop_central / 13)
    h13 = np.maximum(0, float(((C1_T + C2_T + C3_T + C4_T) / total_cargas) - prop_traseira)) / float(prop_traseira / 13)

    fit = fit - (h1 + h2 + h3 + h4 + h5 + h6 + h7 + h8 + h9 + h10 + h11 + h12 + h13)

    return fit


def evaluate_(candidates, args):
    fitness = []
    for ca in candidates:
        fit = perform_fitness(ca[0], ca[1], ca[2], ca[3], ca[4], ca[5], ca[6], ca[7], ca[8], ca[9], ca[10], ca[11])
        fitness.append(fit)
    return fitness


def solution_evaluation(C1_D, C1_C, C1_T, C2_D, C2_C, C2_T, C3_D, C3_C, C3_T, C4_D, C4_C, C4_T):
    # carga1
    C1_D = np.round(C1_D)
    C1_C = np.round(C1_C)
    C1_T = np.round(C1_T)

    # carga2
    C2_D = np.round(C2_D)
    C2_C = np.round(C2_C)
    C2_T = np.round(C2_T)

    # carga3
    C3_D = np.round(C3_D)
    C3_C = np.round(C3_C)
    C3_T = np.round(C3_T)

    # carga4
    C4_D = np.round(C4_D)
    C4_C = np.round(C4_C)
    C4_T = np.round(C4_T)

    print("Cargas totais por compartimento do avião\n")

    print("PESO POR COMPARTIMENTO EM KG\n")
    print("Carga 01 - dianteira:", C1_D)
    print("Carga 01 - central:", C1_C)
    print("Carga 01 - traseira:", C1_T)
    print("Carga 01 - Total:", (C1_D + C1_C + C1_T))

    print("\n\nCarga 02 - dianteira:", C2_D)
    print("Carga 02 - central:", C2_C)
    print("Carga 02 - traseira:", C2_T)
    print("Carga 02 - Total:", (C2_D + C2_C + C2_T))

    print("\n\nCarga 03 - dianteira:", C3_D)
    print("Carga 03 - central:", C3_C)
    print("Carga 03 - traseira:", C3_T)
    print("Carga 03 - Total:", (C3_D + C3_C + C3_T))

    print("\n\nCarga 04 - dianteira:", C4_D)
    print("Carga 04 - central:", C4_C)
    print("Carga 04 - traseira:", C4_T)
    print("Carga 04 - Total:", (C4_D + C4_C + C4_T))

    c1 = float(0.31 * C1_D + 0.31 * C1_C + 0.31 * C1_T)
    c2 = float(0.38 * C2_D + 0.38 * C2_C + 0.38 * C2_T)
    c3 = float(0.35 * C3_D + 0.35 * C3_C + 0.35 * C3_T)
    c4 = float(0.285 * C4_D + 0.285 * C4_C + 0.285 * C4_T)

    print("\n\nLUCROS EM R$\n")
    print("Lucro carga 01:", c1)
    print("Lucro carga 02:", c2)
    print("Lucro carga 03:", c3)
    print("Lucro carga 04:", c4)
    print("Lucro Total das 4 cargas:", c1 + c2 + c3 + c4)

    total_cargas = float((C1_D + C1_C + C1_T) + (C2_D + C2_C + C2_T) + (C3_D + C3_C + C3_T) + (C4_D + C4_C + C4_T))

    print("\n\nTOTAL DE CARREGAMENTO DAS CARGAS: ", total_cargas)

    prop_dianteira = float(10000 / total_cargas)
    prop_central = float(16000 / total_cargas)
    prop_traseira = float(8000 / total_cargas)

    print("\n\nPROPORÇÃO DAS CARGAS\n")
    print("Proporção de Carga Dianteira: ", prop_dianteira)
    print("\nProporção de Carga Central: ", prop_central)
    print("\nProporção de Carga Traseira: ", prop_traseira)


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
                          bounder=ec.Bounder(0, 16000),
                          max_generations=8000,
                          num_imputs=12,
                          crossover_rae=1.0,
                          num_crossover_points=1,
                          mutation_rate=0.125,
                          num_elites=1,
                          num_selected=2,
                          tournament_size=75)

    final_pop.sort(reverse=True)
    print(final_pop[0])

    perform_fitness(final_pop[0].candidate[0], final_pop[0].candidate[1],final_pop[0].candidate[2],final_pop[0].candidate[3],final_pop[0].candidate[4],final_pop[0].candidate[5],final_pop[0].candidate[6],final_pop[0].candidate[7],final_pop[0].candidate[8],final_pop[0].candidate[9],final_pop[0].candidate[10],final_pop[0].candidate[11])
    solution_evaluation(final_pop[0].candidate[0], final_pop[0].candidate[1], final_pop[0].candidate[2], final_pop[0].candidate[3], final_pop[0].candidate[4], final_pop[0].candidate[5], final_pop[0].candidate[6], final_pop[0].candidate[7], final_pop[0].candidate[8], final_pop[0].candidate[9], final_pop[0].candidate[10], final_pop[0].candidate[11])


main()
