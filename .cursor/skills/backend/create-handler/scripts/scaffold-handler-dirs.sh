#!/bin/bash
# Demo script for Cursor skills scripts/ support.
# Creates handler directory structure. Usage: ./scripts/scaffold-handler-dirs.sh <entity> <operation>
# Example: ./scripts/scaffold-handler-dirs.sh order create
set -e
ENTITY=${1:?Entity required (e.g. order, product)}
OPERATION=${2:?Operation required (e.g. create, read, update, list)}
BASE="src/apis/handlers/v1"
mkdir -p "$BASE/$ENTITY/$OPERATION"/{logic,schemas}
echo "Created: $BASE/$ENTITY/$OPERATION/{logic,schemas}"
