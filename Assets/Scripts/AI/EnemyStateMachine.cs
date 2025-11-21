using UnityEngine;

namespace NotebookWar.AI
{
    public class EnemyStateMachine
    {
        private IEnemyState currentState;
        private EnemyBase enemy;

        public EnemyStateMachine(EnemyBase enemyBase)
        {
            enemy = enemyBase;
        }

        public void Start()
        {
            // Start with patrol state by default
            ChangeState(new PatrolState(enemy));
        }

        public void Update()
        {
            currentState?.Update();
        }

        public void ChangeState(IEnemyState newState)
        {
            currentState?.Exit();
            currentState = newState;
            currentState?.Enter();
        }

        public IEnemyState GetCurrentState() => currentState;
    }

    public interface IEnemyState
    {
        void Enter();
        void Update();
        void Exit();
    }
}