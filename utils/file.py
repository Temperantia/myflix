from json import load,  dump
from typing import Any, Dict


def read_json(name: str) -> Dict[str, Any]:
  return load(open(name, 'r', encoding='utf-8'))


def write_json(name: str, data: Dict[str, Any]) -> None:
  dump(data, open(name,
                  'w', encoding='utf-8'), ensure_ascii=False, indent=2)
