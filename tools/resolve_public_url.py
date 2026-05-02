from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PUBLIC_URL = "https://fzr400r3en2-sys.github.io/oryouri-mazemaze/"
SAMPLE_PUBLIC_URL = DEFAULT_PUBLIC_URL


@dataclass(frozen=True)
class PublicUrlResult:
    url: str
    source: str


def normalize_url(value: str) -> str:
    return value.strip()


def read_public_url_file(root: Path) -> str | None:
    path = root / "public_url.txt"
    if not path.exists():
        return None

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            return line
    return None


def ensure_sample_file(root: Path) -> Path:
    path = root / "public_url.sample.txt"
    if not path.exists():
        path.write_text(SAMPLE_PUBLIC_URL + "\n", encoding="utf-8", newline="\n")
    return path


def git_origin_url(root: Path) -> str | None:
    try:
        completed = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            cwd=root,
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return None

    value = completed.stdout.strip()
    return value or None


def parse_github_owner_repo(remote_url: str) -> tuple[str, str] | None:
    patterns = [
        r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?/?$",
        r"^git@github\.com:(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?$",
        r"^ssh://git@github\.com/(?P<owner>[^/]+)/(?P<repo>[^/]+?)(?:\.git)?/?$",
    ]

    for pattern in patterns:
        match = re.match(pattern, remote_url)
        if match:
            return match.group("owner"), match.group("repo")
    return None


def infer_pages_url_from_remote(root: Path) -> str | None:
    remote_url = git_origin_url(root)
    if not remote_url:
        return None

    owner_repo = parse_github_owner_repo(remote_url)
    if not owner_repo:
        return None

    owner, repo = owner_repo
    repo_lower = repo.lower()
    if repo_lower == f"{owner.lower()}.github.io":
        return f"https://{owner}.github.io/"
    return f"https://{owner}.github.io/{repo}/"


def resolve_public_url(root: Path = ROOT, use_default: bool = True) -> PublicUrlResult:
    env_url = normalize_url(os.environ.get("PUBLIC_URL", ""))
    if env_url:
        return PublicUrlResult(env_url, "PUBLIC_URL")

    file_url = read_public_url_file(root)
    if file_url:
        return PublicUrlResult(normalize_url(file_url), "public_url.txt")

    if use_default and DEFAULT_PUBLIC_URL:
        return PublicUrlResult(DEFAULT_PUBLIC_URL, "default")

    remote_url = infer_pages_url_from_remote(root)
    if remote_url:
        return PublicUrlResult(remote_url, "git remote origin")

    sample_path = ensure_sample_file(root)
    raise RuntimeError(f"公開URLを推定できませんでした。{sample_path.name} を参考に public_url.txt を作成してください。")


def main() -> None:
    parser = argparse.ArgumentParser(description="GitHub Pagesで公開するゲームURLを解決します。")
    parser.add_argument("--json", action="store_true", help="URLと決定元をJSONで出力します。")
    parser.add_argument("--show-source", action="store_true", help="決定元も一緒に出力します。")
    parser.add_argument("--no-default", action="store_true", help="固定既定値を使わず、git remoteからの推定を試します。")
    args = parser.parse_args()

    result = resolve_public_url(use_default=not args.no_default)
    if args.json:
        print(json.dumps({"url": result.url, "source": result.source}, ensure_ascii=False))
    elif args.show_source:
        print(f"{result.source}\t{result.url}")
    else:
        print(result.url)


if __name__ == "__main__":
    main()
