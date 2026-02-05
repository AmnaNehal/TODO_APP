import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# ensure backend/ is on PYTHONPATH
sys.path.append(str(Path(__file__).parent))

load_dotenv()

from agents import Runner
from agents.mcp import MCPServerStdio

from ai_agents.todo_agent import build_todo_agent


async def main():
    # Start your local MCP server process over stdio
    async with MCPServerStdio(
        name="todo-mcp-stdio",
        params={
            "command": "python",
            "args": ["mcp_server.py"],
            "cwd": str(Path(__file__).parent),
        },
        cache_tools_list=True,
    ) as server:
        agent = build_todo_agent(server)

        user_id = "ziakhan"

        r1 = await Runner.run(agent, f'Add a task to buy groceries for user_id={user_id}')
        print("Assistant 1:", r1.final_output)

        r2 = await Runner.run(agent, f"Show me pending tasks for user_id={user_id}")
        print("Assistant 2:", r2.final_output)


if __name__ == "__main__":
    asyncio.run(main())
