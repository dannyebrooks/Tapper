<!-- managed:linked-repos -->
## Linked Repositories
- dannyebrooks/Tapper
<!-- /managed:linked-repos -->

# TapFlow Team Code Workflow

## Branch Strategy
- **main** — production-ready code. Always deployable.
- **feature/*** — feature branches for all work (e.g. `feature/analytics`, `feature/sound-effects`)

## Process
1. Members clone the repo and create a feature branch from `main`
2. All work happens on feature branches
3. When a member finishes, they push their branch and create a Pull Request
4. The lead reviews the PR using `merge_pr` tool
5. Approved PRs are squashed into `main`

## PR Standards
- PRs should be focused on one feature/fix
- Test that the game runs before submitting
- Keep commits clean and descriptive
