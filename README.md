# https://poe2.re

## Path of Exile 2 Regex Tool

A tool for generating vendor search strings. With no false positives matches and with query shortening, so you can fit more stuff in to your search!

## Reporting a bug
If you encounter a bug or have a suggestion:
1. Go to the [Issues](https://github.com/veiset/poe2.re/issues) tab.
2. Open a "New Issue".
3. Describe the problem and provide steps to reproduce it.

## Contributing

Contributions are always welcome. To keep things organized:

*   **Join the discord server:** https://discord.gg/AR9AxAYudF
*   **Discuss first:** It’s best to discuss ideas or planned changes on discord before starting the work.
*   **Check Issues:** Take a look at the [open issues](https://github.com/veiset/poe2.re/issues) to see what needs help or to make sure a topic isn't already being worked on.
*   **Fork and PR:** Once everything is ready, fork the project and submit a pull request.


## Generated files
Files under [public/generated](https://github.com/veiset/poe2.re/tree/main/public/generated) are generated files and 
changing these files won't solve any issues. Please report it as a bug, instead of making a pull request with changes,
if you think the issue is in the generated regular expressions.

## Development Setup
Follow these steps to run the development environment locally:

```bash
# Clone the repo
git clone git@github.com:veiset/poe2.re.git
cd poe2.re

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```
