using UnityEngine;
using NotebookWar.Data;
using NotebookWar.Input;
using NotebookWar.UI;

namespace NotebookWar.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        [SerializeField] private PlayerStats stats;
        [SerializeField] private Transform cameraTransform;
        [SerializeField] private float mouseSensitivity = 2f;

        private CharacterController controller;
        private IInputProvider input;
        private Vector3 velocity;
        private bool isGrounded;
        private bool isCrouching;
        private float verticalRotation;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
            input = new KeyboardMouseInput();
            Cursor.lockState = CursorLockMode.Locked;
        }

        private void Update()
        {
            HandleMovement();
            HandleRotation();
            HandleStamina();
        }

        private void HandleMovement()
        {
            isGrounded = controller.isGrounded;

            if (isGrounded && velocity.y < 0)
                velocity.y = -2f;

            Vector2 moveInput = input.GetMovementInput();
            Vector3 move = transform.right * moveInput.x + transform.forward * moveInput.y;

            float speed = stats.walkSpeed;
            if (input.GetSprintInput() && stats.currentStamina > 0)
                speed = stats.sprintSpeed;
            else if (input.GetCrouchInput())
                speed = stats.crouchSpeed;

            controller.Move(move * speed * Time.deltaTime);

            if (input.GetJumpInput() && isGrounded)
                velocity.y = Mathf.Sqrt(stats.jumpForce * -2f * Physics.gravity.y);

            velocity.y += Physics.gravity.y * Time.deltaTime;
            controller.Move(velocity * Time.deltaTime);
        }

        private void HandleRotation()
        {
            Vector2 lookInput = input.GetLookInput();

            transform.Rotate(Vector3.up * lookInput.x * mouseSensitivity);

            verticalRotation -= lookInput.y * mouseSensitivity;
            verticalRotation = Mathf.Clamp(verticalRotation, -90f, 90f);
            cameraTransform.localRotation = Quaternion.Euler(verticalRotation, 0f, 0f);
        }

        private void HandleStamina()
        {
            if (input.GetSprintInput() && isGrounded)
                stats.currentStamina -= stats.sprintStaminaCost * Time.deltaTime;
            else
                stats.currentStamina += stats.staminaRegenRate * Time.deltaTime;

            stats.currentStamina = Mathf.Clamp(stats.currentStamina, 0f, stats.maxStamina);
        }

        public void TakeDamage(float damage)
        {
            if (stats.currentArmor > 0)
            {
                float armorDamage = Mathf.Min(damage * 0.5f, stats.currentArmor);
                stats.currentArmor -= armorDamage;
                damage -= armorDamage;
            }

            stats.currentHealth -= damage;
            stats.currentHealth = Mathf.Max(stats.currentHealth, 0f);

            // Show damage indicator
            DamageIndicator damageIndicator = FindObjectOfType<DamageIndicator>();
            if (damageIndicator != null)
                damageIndicator.ShowDamage();

            if (stats.currentHealth <= 0)
                Die();
        }

        private void Die()
        {
            Debug.Log("Player died!");
            // TODO: Implement death logic
        }

        public void Heal(float amount)
        {
            stats.currentHealth += amount;
            stats.currentHealth = Mathf.Min(stats.currentHealth, stats.maxHealth);
        }

        public void RestoreArmor(float amount)
        {
            stats.currentArmor += amount;
            stats.currentArmor = Mathf.Min(stats.currentArmor, stats.maxArmor);
        }

        // Getters for pickup system
        public float GetCurrentHealth() => stats.currentHealth;
        public float GetMaxHealth() => stats.maxHealth;
        public float GetCurrentArmor() => stats.currentArmor;
        public float GetMaxArmor() => stats.maxArmor;
    }
}
