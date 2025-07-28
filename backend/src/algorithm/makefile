ECHO = echo
REMOVE = rm 

#Nom du compilateur
COMP = g++
#Nom de l'EDL
EDL = g++
#Options de compilation
CCFLAGS = -std=c++11 #-Wall -ansi -pedantic -DMAP -g -D -W -I
LIBS = # -lm

EXE = exe 
CLEAN = clean 


# Nom de l'exécutable
TARGET = main

# Répertoires
SRC_DIR = src
INC_DIR = headers
OBJ_DIR = obj
#BIN_DIR = bin

# Liste des fichiers source
SRCS = $(wildcard $(SRC_DIR)/*.cpp)

# Liste des fichiers d'en-tête
HEADERS = $(wildcard $(INC_DIR)/*.h)

# Liste des fichiers objets dérivés des fichiers source
OBJS = $(patsubst $(SRC_DIR)/%.cpp,$(OBJ_DIR)/%.o,$(SRCS))

# Règle par défaut
all: directories $(TARGET)

# Règle de compilation pour générer l'exécutable
$(TARGET): $(OBJS)
	$(COMP) $(CCFLAGS) -o $@ $^

# Règle de compilation générique pour les fichiers objets
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp $(HEADERS)
	$(COMP) $(CCFLAGS) -c -o $@ $<

# Créer les répertoires nécessaires
directories:
	mkdir -p $(OBJ_DIR) 
#$(BIN_DIR)

# Nettoyer les fichiers intermédiaires et l'exécutable
clean:
	$(REMOVE) -rf $(OBJ_DIR) $(TARGET)

# Mettre à jour les exécutables
update: clean all

.PHONY: all clean update directories
